import data from './data.json'
import { useState } from 'react'
import Fuse from 'fuse.js'
import ReactHtmlParser from 'react-html-parser'
import './App.css'


const options = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.6,
  keys: ['category', 'question', 'answers']
}

const fuzzy = (search) => {
  const result = fuse.search(search)
  // console.log(result)
  return result.map(line => ({ ...line.item, score: line.score }))
}

const prepareData = (data) => {
  return data.map(elem => {
    const q = elem.question.replace(/`(.*?)`/g, `<span class="reference">$1</span>`)
    return { ...elem, question: q }
  })
}

const preparedData = prepareData(data)
const fuse = new Fuse(preparedData, options)

function App() {
  const [search, setsearch] = useState("")
  const result = search === "" ? preparedData : fuzzy(search)

  return (
    <div className="App">
      <div class="wrapper">
        <div className="searchWrapper">
          <input
            id="search-box"
            autofocus="true"
            placeholder="Type Fuzzy Filter Query here"
            onChange={(e) => {
              const value = e.target.value
              // console.log("search text", value)
              setsearch(value)
            }} value={search} />
        </div>
        <table>
          <tr>
            <th className="combo">Combo</th>
            <th className="question">Decription</th>
            <th className="category">Category</th>
            <th className={"score" + ((result.length && !result[0].score) ? " hidden" : "")}>
              Score
            </th>
          </tr>
          {result.map(({ category, question, solution, score = 0 }) => {
            return (
              <tr>
                <td className="combo">
                  {solution.map(e => <code className="keycombo">{e}<wbr/></code>)}
                  </td>
                <td className="question">{ReactHtmlParser(question)}</td>
                <td className="category">{category}</td>
                <td className={"score" + (!score ? " hidden" : "")}>
                  {score && Math.round((1 - score).toFixed(2) * 100)}%
                </td>
              </tr>
            )
          })}
        </table>
      </div>
    </div>
  );
}

export default App;

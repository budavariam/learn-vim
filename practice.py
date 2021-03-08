#!/bin/python

import random
import re

CRD = '\033[31m' # Red Text
CGR = '\033[32m' # Green Text
CYE = '\033[33m' # Yellow Text
CBL = '\033[34m' # Blue Text
CCY = '\033[36m' # Cyan Text
CRE = '\033[m'   # reset text color

def parse_data(sourcefile):
    """ Load the text as questions and answers """
    result = []
    taskregexp = re.compile(r"^\s*\*\s+(`.*`)\s-\s+(.*)$")
    categoryregexp = re.compile(r"^##\s(.*)$")
    current_category = ""
    with open(sourcefile, 'r') as raw_data:
        for line in raw_data:
           m = taskregexp.match(line)
           if not m is None:
               answers = [x[1:-1].strip() if (x[-1]=="`" and x[0]=="`") else x.strip() for x in m.group(1).replace("```", "").replace("``", "").split(", ")]
               question = m.group(2)
               result.append((current_category, question, answers))
           else:
               cat = categoryregexp.match(line)
               if not cat is None:
                   current_category = cat.group(1)
    return result
        
class Game():
    """ Class of the game that evaluates your knowledge """

    def __init__(self, raw_data):
        self.data = raw_data
        self.score = 0

    def play(self):
        print(f"Currently you have {len(self.data)} tips to practice.")
        print(f"If there are some {CGR}color coded texts{CRE}, those should be included in the answer.")
        print(f"The game lasts until you answer '{CRD}---{CRE}'. Happy practicing!")
        random.shuffle(self.data)
        i = 0
        for [category, question, answers] in self.data:
            i+=1
            answerstring = ", ".join(answers)
            print()
            print(f"{CCY}## {category}{CRE}")
            colorfulQuestion = re.sub(r"`(.*?)`", rf"{CGR}\1{CRE}", question)
            guess = input(f"{colorfulQuestion}:\n")
            if guess == "---":
                break
            count_color = CRD
            if any([x == guess for x in answers]):
                self.score+=1
                count_color = CGR
            print(f"({count_color}{self.score}{CRE}/{i}). Answer: {CYE}{answerstring}{CRE}")

    def printscore(self):
        print(f"Your score is {CYE}Over 9000!!!!11!!{CRE} jklol, it's {CGR}{self.score}{CRE}. Good job!")

def export_json(data):
    import json
    import path
    with open(path.join('webapp','src','data.json'), 'w') as file:
        marked_data = [{"category":x[0], "question": x[1], "solution": x[2]} for x in data]
        json.dump(marked_data, file, indent=2, sort_keys=True)

def main():
    """Start the game"""
    sourcefile="./vim-cheatsheet.md"
    
    game_input = parse_data(sourcefile)
    # export_json(game_input)
    game = Game(game_input)
    game.play()
    game.printscore()


if __name__ == "__main__":
    main()


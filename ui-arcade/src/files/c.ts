export const cFile = `/*
 * utils.c - General-purpose C utility library.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <assert.h>

/* -------------------------------------------------------------------------
 * Dynamic array
 * ---------------------------------------------------------------------- */

typedef struct {
    void   **data;
    size_t   size;
    size_t   capacity;
} Vec;

Vec *vec_new(void) {
    Vec *v = malloc(sizeof(Vec));
    if (!v) return NULL;
    v->data     = malloc(8 * sizeof(void *));
    v->size     = 0;
    v->capacity = 8;
    return v;
}

bool vec_push(Vec *v, void *item) {
    if (v->size == v->capacity) {
        size_t new_cap = v->capacity * 2;
        void **d = realloc(v->data, new_cap * sizeof(void *));
        if (!d) return false;
        v->data     = d;
        v->capacity = new_cap;
    }
    v->data[v->size++] = item;
    return true;
}

void *vec_get(const Vec *v, size_t i) {
    if (i >= v->size) return NULL;
    return v->data[i];
}

void vec_free(Vec *v) {
    free(v->data);
    free(v);
}

/* -------------------------------------------------------------------------
 * Hash map (open-addressing, FNV-1a hash)
 * ---------------------------------------------------------------------- */

#define MAP_INIT_CAP 16
#define MAP_LOAD     0.75

typedef struct {
    char   *key;
    void   *value;
    bool    occupied;
    bool    deleted;
} MapEntry;

typedef struct {
    MapEntry *entries;
    size_t    size;
    size_t    capacity;
} HashMap;

static uint64_t fnv1a(const char *s) {
    uint64_t h = 14695981039346656037ULL;
    for (; *s; ++s) h = (h ^ (uint8_t)*s) * 1099511628211ULL;
    return h;
}

HashMap *map_new(void) {
    HashMap *m = calloc(1, sizeof(HashMap));
    if (!m) return NULL;
    m->entries  = calloc(MAP_INIT_CAP, sizeof(MapEntry));
    m->capacity = MAP_INIT_CAP;
    return m;
}

static bool map_insert_raw(MapEntry *entries, size_t cap,
                            const char *key, void *value) {
    uint64_t idx = fnv1a(key) % cap;
    for (size_t i = 0; i < cap; ++i) {
        MapEntry *e = &entries[(idx + i) % cap];
        if (!e->occupied || e->deleted) {
            e->key      = (char *)key;
            e->value    = value;
            e->occupied = true;
            e->deleted  = false;
            return true;
        }
        if (strcmp(e->key, key) == 0) {
            e->value = value;
            return true;
        }
    }
    return false;
}

bool map_put(HashMap *m, const char *key, void *value) {
    if ((double)m->size / m->capacity >= MAP_LOAD) {
        size_t    new_cap = m->capacity * 2;
        MapEntry *new_e   = calloc(new_cap, sizeof(MapEntry));
        if (!new_e) return false;
        for (size_t i = 0; i < m->capacity; ++i) {
            if (m->entries[i].occupied && !m->entries[i].deleted)
                map_insert_raw(new_e, new_cap,
                               m->entries[i].key, m->entries[i].value);
        }
        free(m->entries);
        m->entries  = new_e;
        m->capacity = new_cap;
    }
    if (map_insert_raw(m->entries, m->capacity, key, value))
        ++m->size;
    return true;
}

void *map_get(const HashMap *m, const char *key) {
    uint64_t idx = fnv1a(key) % m->capacity;
    for (size_t i = 0; i < m->capacity; ++i) {
        MapEntry *e = &m->entries[(idx + i) % m->capacity];
        if (!e->occupied) return NULL;
        if (!e->deleted && strcmp(e->key, key) == 0) return e->value;
    }
    return NULL;
}

void map_free(HashMap *m) {
    free(m->entries);
    free(m);
}

/* -------------------------------------------------------------------------
 * String helpers
 * ---------------------------------------------------------------------- */

char *str_dup(const char *s) {
    size_t n = strlen(s) + 1;
    char  *d = malloc(n);
    if (d) memcpy(d, s, n);
    return d;
}

char *str_trim(char *s) {
    while (*s == ' ' || *s == '\\t') ++s;
    char *end = s + strlen(s) - 1;
    while (end > s && (*end == ' ' || *end == '\\t' || *end == '\\n')) --end;
    *(end + 1) = '\\0';
    return s;
}

int str_starts_with(const char *s, const char *prefix) {
    return strncmp(s, prefix, strlen(prefix)) == 0;
}

/* -------------------------------------------------------------------------
 * Simple linked list
 * ---------------------------------------------------------------------- */

typedef struct Node {
    void        *data;
    struct Node *next;
} Node;

Node *node_new(void *data) {
    Node *n = malloc(sizeof(Node));
    if (!n) return NULL;
    n->data = data;
    n->next = NULL;
    return n;
}

void list_prepend(Node **head, void *data) {
    Node *n = node_new(data);
    if (!n) return;
    n->next = *head;
    *head   = n;
}

void list_free(Node *head, void (*free_data)(void *)) {
    while (head) {
        Node *next = head->next;
        if (free_data) free_data(head->data);
        free(head);
        head = next;
    }
}

/* -------------------------------------------------------------------------
 * Math helpers
 * ---------------------------------------------------------------------- */

int clamp_i(int v, int lo, int hi) {
    if (v < lo) return lo;
    if (v > hi) return hi;
    return v;
}

double lerp(double a, double b, double t) {
    return a + (b - a) * t;
}

uint32_t next_power_of_two(uint32_t n) {
    --n;
    n |= n >> 1;  n |= n >> 2;
    n |= n >> 4;  n |= n >> 8;
    n |= n >> 16;
    return n + 1;
}
`

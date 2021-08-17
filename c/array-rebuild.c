#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#define INITIAL_CAP 2
#define INCR_CAP(cap_ptr) *cap_ptr += 2

void die(const char* message) {
  printf("%s\n", message);
  exit(1);
}

// Why did I use the `int**` pointer type for `arr`?
// See: https://stackoverflow.com/a/34844026
void arr_rebuild(int* cap, int len, int** arr) {
  printf("\n---------------------\nMust rebuild...\n");
  printf("Current stats: cap=%i, len=%i (addr=%p);\n", *cap, len, arr);

  INCR_CAP(cap);
  int* new_arr = malloc(*cap * sizeof(int));
  if (new_arr == NULL) {
    die("Could not allocate.");
  }
  for (int i = 0; i < len; i++) {
    new_arr[i] = (*arr)[i];
  }
  free(*arr);
  *arr = new_arr;

  printf("New stats: cap=%i, len=%i (addr=%p).\n\n", *cap, len, arr);
}

void arr_insert(int* cap, int* len, int** arr, int elm) {
  if (*len >= *cap) {
    arr_rebuild(cap, *len, arr);
  }
  (*arr)[(*len)++] = elm;

  printf("Inserted '%i'.\n", elm);
  printf("New stats: cap=%i, len=%i (addr=%p).\n\n", *cap, *len, arr);
}

int main() {
  int curr_cap = INITIAL_CAP;
  int curr_len = 0;
  int* arr = malloc(curr_cap * sizeof(int));
  if (arr == NULL) {
    die("Could not allocate.");
  }

  while (true) {
    printf("Enter a number: ");
    int n;
    scanf("%i", &n);
    arr_insert(&curr_cap, &curr_len, &arr, n);

    // TODO: Implement an exit way.
  }

  return 0;
}

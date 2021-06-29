#include <stdio.h>
#include <stdlib.h>

#define DEBUG 1
#define BIGN_MAX_LENGTH 2021

// Prints an array of int members.
void print_int_arr(int arr[], int size) {
  printf("(%d) { ", size);
  for (int i = 0; i < size; i++) {
    printf("%d", arr[i]);
    if (i != size - 1) {
      printf(", ");
    }
  }
  printf(" }\n");
}

// Bign.
typedef struct {
  int data[BIGN_MAX_LENGTH];
  int len;
} Bign;

// Prints the given Bign.
void bign_print(Bign *bign) {
  if (DEBUG) {
    print_int_arr(bign->data, bign->len);
  }
  if (bign->data[0] == 1) {
    printf("-");
  }
  for (int i = bign->len - 1; i >= 1; i--) {
    printf("%d", bign->data[i]);
  }
  printf("\n");
}

// Creates and returns a new Bign.
Bign bign_create(int num) {
  Bign bign;

  bign.data[0] = 0;
  if (num < 0) {
    bign.data[0] = 1;
    num *= -1;
  }

  int i = 1;
  while (num != 0) {
    if (i >= BIGN_MAX_LENGTH - 1) {
      printf("Capped.\n");
      break;
    }
    bign.data[i++] = num % 10;
    num /= 10;
  }
  bign.len = i;
  return bign;
}

int main() {
  int n;
  printf("Enter a number: ");
  scanf("%d", &n);

  Bign bign = bign_create(n);
  bign_print(&bign);
}

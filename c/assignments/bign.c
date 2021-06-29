#include <stdio.h>

#define DEBUG 1
#define MAX 2021

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

void print_bign(int bign[], int bign_size) {
  if (DEBUG) {
    print_int_arr(bign, bign_size);
  }
  if (bign[0] == 1) {
    printf("-");
  }
  for (int i = bign_size - 1; i >= 1; i--) {
    printf("%d", bign[i]);
  }
  printf("\n");
}

int create_bign(int num, int bign[]) {
  bign[0] = 0;
  if (num < 0) {
    bign[0] = 1;
    num *= -1;
  }

  int i = 1;
  while (num != 0) {
    if (i >= MAX - 1) {
      printf("Capped.\n");
      return i;
    }
    bign[i++] = num % 10;
    num /= 10;
  }
  return i;
}

int main() {
  int n;
  printf("Enter a number: ");
  scanf("%d", &n);

  int bign[MAX];
  int bign_size = create_bign(n, bign);

  print_bign(bign, bign_size);
}

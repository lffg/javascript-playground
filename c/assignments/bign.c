#include <stdio.h>

#define DEBUG 1
#define MAX 2021

typedef struct {
  int data[MAX];
  int len;
} Bign;

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

void print_bign(Bign *bign) {
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

Bign create_bign(int num) {
  Bign bign;

  bign.data[0] = 0;
  if (num < 0) {
    bign.data[0] = 1;
    num *= -1;
  }

  int i = 1;
  while (num != 0) {
    if (i >= MAX - 1) {
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

  Bign bign = create_bign(n);
  print_bign(&bign);
}

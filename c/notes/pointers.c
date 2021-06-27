#include <stdio.h>

////////////////////////////////////////////////////////////////////////////////

void test_pointer_param(int int_val, int *int_ptr) {
  printf("@test_pointer_param (int_val is `%d`)\n", int_val);
  int_val += 20;
  printf("@test_pointer_param (int_val is now `%d`)\n", int_val);

  printf("@test_pointer_param (*int_ptr is `%d`)\n", *int_ptr);
  *int_ptr += 5;
  printf("@test_pointer_param (*int_ptr is now `%d`)\n", *int_ptr);
}

void exp1() {
  int my_int = 1000;
  int *my_int_ptr = &my_int;

  printf("I am a pointer: %p\n", my_int_ptr);
  printf("I am the int (obtained by a pointer deref): %d\n", *my_int_ptr);

  printf("---\n");

  printf("Before test_pointer_param: (my_int is `%d`); (*my_int_ptr is `%d`)\n",
         my_int, *my_int_ptr);
  test_pointer_param(my_int, my_int_ptr);
  printf("After test_pointer_param: (my_int is now `%d`); (*my_int_ptr is now "
         "`%d`)\n",
         my_int, *my_int_ptr);
}

////////////////////////////////////////////////////////////////////////////////

int main() {
  exp1();
  return 0;
}

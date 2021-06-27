#include <math.h>
#include <stdio.h>

int quadratic(float a, float b, float c, float *x1, float *x2) {
  float delta = powf(b, 2) - 4 * a * c;
  if (delta < 0)
    return -1;

  float delta_root = sqrtf(delta);
  *x1 = (-b + delta_root) / (2 * a);
  *x2 = (-b - delta_root) / (2 * a);

  return delta == 0 ? 0 : 1;
}

int main() {
  float a, b, c;
  printf("Enter the coefficients (a, b and c) as floating-point numbers. "
         "Separate each one by spaces.\n");
  scanf("%f %f %f", &a, &b, &c);

  printf("Given coefficients: (a = %f); (b = %f); (c = %f).\n", a, b, c);
  float x1, x2;
  int root_status = quadratic(a, b, c, &x1, &x2);

  switch (root_status) {
  case -1:
    printf("No real roots.\n");
    break;
  case 0:
    printf("One real root: (x = %f).\n", x1);
    break;
  case 1:
    printf("Two real roots: (x1 = %f) and (x2 = %f).\n", x1, x2);
    break;
  }

  return 0;
}

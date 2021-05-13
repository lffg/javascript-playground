#include <stdio.h>

int main()
{
  int freq = 0;

  int target;
  scanf("%u", &target);

  while (1)
  {
    int current;
    scanf("%u", &current);

    if (current == 0)
      break;
    if (current == target)
      freq++;
  }

  printf("%u\n", freq);
  return 0;
}

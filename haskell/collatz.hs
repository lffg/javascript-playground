collatzTerm :: Integer -> Integer
collatzTerm x
  | x `mod` 2 == 1 = x * 3 + 1
  | otherwise = x `div` 2

collatzAccum :: Integer -> [Integer] -> [Integer]
collatzAccum 1 xs = 1 : xs
collatzAccum x xs = collatzAccum (collatzTerm x) (x : xs)

collatz :: Integer -> [Integer]
collatz x = reverse $ collatzAccum x []

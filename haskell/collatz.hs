-- https://en.wikipedia.org/wiki/Collatz_conjecture#Statement_of_the_problem
collatz :: Integer -> Integer
collatz x | odd x     = x * 3 + 1
          | otherwise = x `div` 2

-- This is NOT tail recursive, right?
-- Why?
collatzSeq :: Integer -> [Integer]
collatzSeq 1 = [1]
collatzSeq x = x : collatzSeq (collatz x)

-- I am sure this is tail recursive, right?
-- Why?
collatzSeq' :: Integer -> [Integer]
collatzSeq' = collatzAcc []
 where
  collatzAcc _   1 = [1]
  collatzAcc acc x = x : collatzAcc acc (collatz x)


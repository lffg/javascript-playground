collatz :: Integer -> Integer
collatz x | odd x     = x * 3 + 1
          | otherwise = x `div` 2

collatzSeq :: Integer -> [Integer]
collatzSeq 1 = [1]
collatzSeq x = x : collatzSeq (collatz x)

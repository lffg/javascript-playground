use std::collections::HashMap;
use std::hash::Hash;

pub trait Freq<T: Eq + Hash>: Iterator {
    fn freq(self) -> HashMap<T, usize>;
}

impl<I, T> Freq<T> for I
where
    I: Iterator<Item = T>,
    T: Eq + Hash,
{
    fn freq(self) -> HashMap<T, usize> {
        self.fold(HashMap::new(), |mut map, curr| {
            *map.entry(curr).or_insert(0) += 1;
            map
        })
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use super::Freq;

    #[test]
    fn test_1() {
        let freq = "AAABBC".chars().freq();
        assert_eq!(freq, HashMap::from([('A', 3), ('B', 2), ('C', 1)]))
    }
}

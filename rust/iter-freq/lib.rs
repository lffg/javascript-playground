use std::collections::HashMap;
use std::hash::Hash;

pub mod ext {
    use super::*;

    pub trait Freq<T: Eq + Hash>: Iterator {
        fn freq(self) -> HashMap<T, usize>;
    }

    impl<I, K> Freq<K> for I
    where
        I: Iterator<Item = K>,
        K: Eq + Hash,
    {
        fn freq(self) -> HashMap<K, usize> {
            self.fold(HashMap::new(), |mut map, curr| {
                *map.entry(curr).or_insert(0) += 1;
                map
            })
        }
    }
}

pub mod r#fn {
    use super::*;

    pub fn freq<I, K>(iter: I) -> HashMap<K, usize>
    where
        I: Iterator<Item = K>,
        K: Eq + Hash,
    {
        iter.fold(HashMap::new(), |mut map, curr| {
            *map.entry(curr).or_insert(0) += 1;
            map
        })
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use super::{ext::Freq, r#fn::freq};

    #[test]
    fn test_freq_extension_trait() {
        let freq = "AAABBC".chars().freq();
        assert_eq!(freq, HashMap::from([('A', 3), ('B', 2), ('C', 1)]));
    }

    #[test]
    fn test_freq_fn() {
        let iter = "AAABBC".chars();
        assert_eq!(freq(iter), HashMap::from([('A', 3), ('B', 2), ('C', 1)]));
    }
}

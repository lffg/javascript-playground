pub mod utils {
    pub mod iter {
        use std::iter::Peekable;

        pub struct IterWithLast<I>(Peekable<I>)
        where
            I: Iterator;

        impl<I> Iterator for IterWithLast<I>
        where
            I: Iterator,
        {
            type Item = (bool, I::Item);

            fn next(&mut self) -> Option<Self::Item> {
                self.0.next().map(|val| (self.0.peek().is_none(), val))
            }
        }

        pub trait WithLast: Iterator + Sized {
            fn with_last(self) -> IterWithLast<Self>;
        }

        impl<I> WithLast for I
        where
            I: Iterator,
        {
            fn with_last(self) -> IterWithLast<Self> {
                IterWithLast(self.peekable())
            }
        }
    }
}

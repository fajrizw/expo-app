import React, { createContext, useState, useContext, ReactNode } from "react";

interface BookmarkContextType {
  bookmarkedProducts: number[];
  toggleBookmark: (productId: number) => void;
  isBookmarked: (productId: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarkedProducts, setBookmarkedProducts] = useState<number[]>([]);

  const toggleBookmark = (productId: number) => {
    setBookmarkedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isBookmarked = (productId: number) => {
    return bookmarkedProducts.includes(productId);
  };

  return (
    <BookmarkContext.Provider
      value={{ bookmarkedProducts, toggleBookmark, isBookmarked }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmark must be used within a BookmarkProvider");
  }
  return context;
};

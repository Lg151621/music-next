"use client";

import React, { useState, JSX } from "react";

interface Props {
  onSubmit: (text: string) => void;
}

export default function SearchForm({ onSubmit }: Props): JSX.Element {
  const [inputText, setInputText] = useState<string>("");

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setInputText(value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(inputText.trim());
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="search-term">Search for</label>
          <input
            id="search-term"
            type="text"
            className="form-control"
            placeholder="Enter search term here"
            value={inputText}
            onChange={handleChangeInput}
          />
        </div>
      </form>
    </div>
  );
}
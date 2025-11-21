// This is a Client Component because it uses React state
// and listens to user input events.
"use client";

import React, { useState, JSX } from "react";

// The parent passes one prop: a function that receives the user's search text
interface Props {
  onSubmit: (text: string) => void;
}

export default function SearchForm({ onSubmit }: Props): JSX.Element {
  // Local state to store whatever the user types into the input field
  const [inputText, setInputText] = useState<string>("");

  // Runs every time the user types in the search box
  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setInputText(value); // update the local inputText state
  };

  // Runs when the user submits the form (press Enter)
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault(); // prevent the page from refreshing
    onSubmit(inputText.trim()); // send the trimmed text up to the parent
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
            value={inputText}              // controlled input value
            onChange={handleChangeInput}  // update on keystroke
          />
        </div>
      </form>
    </div>
  );
}

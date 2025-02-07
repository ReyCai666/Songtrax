import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Header Component
 * The header component that is displayed on every page.
 * 
 * @component
 * @param {Object} props - The props object.
 * @param {boolean} props.backButton - Whether or not to display the back button.
 * @returns {JSX.Element} The Rendered header component.
 */
export default function Header({ backButton }) {
    const navigate = useNavigate();
    return (
        <header className="page-header">
            <div className="header-logo">
                {backButton &&
                <button className="arrow-back" onClick={() => navigate(-1)}>&larr;
                </button>}
                <h2>
                    <a href="/" className="header-icon-link">SongTrax</a>
                </h2>
            </div>
            <div className="header-app-description">
                <span>Create & Share Location Based Music Samples!</span>
            </div>
        </header>
    );
}
import { useEffect, useRef, useState } from 'react';
import { SCHOOLS } from '../data/schools';
import './SchoolCombobox.css';

export default function SchoolCombobox({ value, onChange, placeholder, id }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    const query = value.trim().toLowerCase();
    const matches = query.length > 0
        ? SCHOOLS.filter((school) => school.toLowerCase().includes(query)).slice(0, 8)
        : [];

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="school-combobox" ref={containerRef}>
            <input
                id={id}
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                autoComplete="off"
            />

            {open && matches.length > 0 && (
                <ul className="school-combobox-list" role="listbox">
                    {matches.map((school) => (
                        <li key={school}>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(school);
                                    setOpen(false);
                                }}
                            >
                                {school}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

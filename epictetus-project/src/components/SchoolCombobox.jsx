import { useEffect, useRef, useState } from 'react';
import { searchSchools } from '../services/schools';
import './SchoolCombobox.css';

export default function SchoolCombobox({ value, onChange, onPick, placeholder, id }) {
    const [open, setOpen] = useState(false);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const query = value.trim();

        if (query.length < 2) {
            setMatches([]);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        const timeout = setTimeout(async () => {
            const { data } = await searchSchools(query);
            if (cancelled) return;
            setMatches(data);
            setLoading(false);
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [value]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const showNoMatches = open && value.trim().length >= 2 && !loading && matches.length === 0;

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
                        <li key={school.id}>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(school.name);
                                    onPick?.(school);
                                    setOpen(false);
                                }}
                            >
                                {school.name}
                                <span className="school-combobox-meta">{school.city}, {school.state}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {showNoMatches && (
                <div className="school-combobox-empty">
                    We couldn&rsquo;t find that school. You can type it manually and continue &mdash;
                    we&rsquo;ll add it once we verify it.
                </div>
            )}
        </div>
    );
}

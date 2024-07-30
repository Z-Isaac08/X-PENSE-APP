import React, { useEffect, useState } from 'react';
import './progress.css';

const Progressbar = ({ spent }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(spent);
    }, [spent]);

    return (
        <div className="progressbar">
            <div
                className="progress"
                style={{
                    width: `${width}%`,
                }}
            >
            </div>
        </div>
    );
};

export default Progressbar;

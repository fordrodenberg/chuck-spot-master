import { useState } from "react";

function useBoolean(initialValue) {

    const [value, setValue] = useState(initialValue);

    function toggleValue(newValue) {
        if (newValue === undefined || typeof newValue !== 'boolean') {
            setValue(!value);
        } else {
            setValue(newValue)
        }
    }

    return [value, toggleValue];
}

export { useBoolean };
import React, { useState, useEffect } from "react";
import { Trans as OriginalTrans } from "react-i18next";
import i18n from '../i18n';


export const AutoTrans = (props) => {
    const [, setLang] = useState(i18n.language);

    useEffect(() => {
        const callback = () => setLang(i18n.language);
        i18n.on("languageChanged", callback);
        return () => i18n.off("languageChanged", callback);
    }, []);

    return <OriginalTrans {...props} />;
};

export default AutoTrans;

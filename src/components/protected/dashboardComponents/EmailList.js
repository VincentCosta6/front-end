import React, { useContext, useCallback } from 'react';
import Email from './Email';

import EmailStore from "../../../stores/email-store"

const EmailList = props => {
    const context = useContext(EmailStore);

    const myEmails = context.emailMap[props.id]

    const deleteEmail = useCallback((id) => {
        context.removeEmail(props.id, id)
    }, [context.emailMap, props.id])

    if(!myEmails) return <></>;
    else {

        let reversed = Array.from(myEmails).reverse();
        if(myEmails.length !== 0)
            return (
                reversed.map((e, i) => <Email key = {e.id} data = {e} context = {context} deleteEmail={deleteEmail} />)
            )
        else return <h3 style = {{ backgroundColor: "var(--primary-color)", color: "var(--font-color)", padding: 15, margin: 0 }}>- No Emails here</h3>
    }
}

export default EmailList;
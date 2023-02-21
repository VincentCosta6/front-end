import React, { useContext, useCallback } from 'react';
import Address from './Adress';

import EmailStore from '../../../stores/email-store';

export const AddressList = props => {
    const context = useContext(EmailStore)

    const handleRemoveAddress = useCallback((id) => {
        context.removeAddress(id)
    }, [context.emailMap, context.addressArr, context.addressMap])

    let reverse = Array.from(context.addressArr).reverse();
    return (
        <div className="body">
            { 
                reverse.length === 0 ? 
                <h1 style = {{ backgroundColor: "var(--primary-color)", padding: 15, boxShadow: "0 0 4px black" }}>Click "Generate Email" to create an inbox</h1> : 
                reverse.map((e, i) => <Address key = {e.id} data = {e} id = {e.id} emails={context.emailMap[e.id]} removeAddress={handleRemoveAddress} />)
            }
        </div>
    );
}
import { useEffect } from 'react'
import { useState } from '@wordpress/element'
import {
    Notice,
} from '@wordpress/components';

const ThemeBlockSupport = () => {

    const [blockSupport, setBlockSupport] = useState(false)

    // Check if the theme supports blocks.
    useEffect(() => {
		wp.apiFetch({path: '/wp-pattern-friend/v2.2/checks/block_support'}).
        then(data => {
                console.log(data)
                setBlockSupport(data)
            },
        )
    }, [])

    if (blockSupport) {
        return (<></>)
    } else {
        return (
            <Notice status="error" isDismissible={false}>Current theme doesn't support blocks. Pattern Friend might not work properly.</Notice>
        )
    }
}

export default ThemeBlockSupport
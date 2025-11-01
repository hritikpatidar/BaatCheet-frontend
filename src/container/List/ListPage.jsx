import React from 'react'
import List from './List'
import AddItem from './AddItem'

const ListPage = () => {
    return (
        <div>
            <div style={{ padding: 20, marginTop:50 }}>
                <h2>Redux List with Images</h2>
                <AddItem />
                <List />
            </div>
        </div>
    )
}

export default ListPage

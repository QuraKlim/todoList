import { useState, useEffect } from "react"
import useFetch from "../services/server";
import ToDoListItem from "../toDoListItem/ToDoListItem";

/**
 * Компонент со списокм дел
 * @returns список дел
 */

const ToDoList = () => {
    const [items, setItems] = useState(null);

    const {fetchData} = useFetch()

    useEffect(() => {
        fetchData((snapshot) => {
            setItems([...snapshot.val()])
        })
        // eslint-disable-next-line
    }, [])

    /**
     * Функция рендера списка дел
     * @returns список дел (li внутри ul)
     */

    const renderList = () => {
        let list;
        if (items && items.length < 2) {
            list = <ToDoListItem key={0} data={{...items[0], "count": 0}}/>
        } else if (items && items.length > 1) {
            list = items.map((i, count) => {
                return <ToDoListItem key={i.title} data={{...i, count}}/>
            })
        }
        
        return  <ul>
                    {list}
                </ul>
    }

    const content = renderList()
    
    return (
        <>
            {content}
        </>
    )
}

export default ToDoList;
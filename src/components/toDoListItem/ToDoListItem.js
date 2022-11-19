import { useEffect, useState } from "react";
import './toDoListItem.css';
import useFetch from "../services/server";

/**
 * Компонент для каждого отдельного дела
 * @param {{count: (number), title: (string), description: (string), ended: (boolean), endDate: (date), filePath: (string)}} props 
 * @returns Отдельный элемент дела
 */

const ToDoListItem = (props) => {
    const {count, title, description, ended, endDate, filePath} = props.data;
    const {changeData, uploadFile, deleteData} = useFetch();
    const [toDoItem, setToDoItem] = useState({title, description, ended, endDate, filePath});
    const [random, setRandom] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('white')
    useEffect(() => {
        setToDoItem({title, description, ended, endDate, filePath})
    }, [title, description, ended, endDate, filePath]);

    useEffect(() => {
        sendData()
        // eslint-disable-next-line
    }, [random])

    const end = new Date(endDate);
    const today = new Date();
    const comparison = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    /**
     * Функция контроля заднего фона в заисимотси от ended и endDate
     */

    useEffect(()=> {
        if (ended) {
            setBackgroundColor('#55d755')
        } else if (comparison > end) {
            setBackgroundColor('#ff5252')
        } else {
            setBackgroundColor('white')
        }
    }, [ended, endDate])

    /**
     * Функция изменения состояния дела
     * @param {event} e 
     */

    function changeState(e) {
        const key = e.target.getAttribute('name')
        setToDoItem({
            ...toDoItem,
            [key]: e.target.value
        })
        setRandom(Math.random())
    }

    /**
     * Функция отправки измененийв в базу данных
     */

    function sendData() {
        changeData(toDoItem, count);
    }

    /**
     * Функция изменения законченности дела
     */

    function endedChange() {
        setToDoItem({...toDoItem, ended: !toDoItem.ended});
        setRandom(Math.random())
    }

    /**
     * Функция удаления дела из списка
     */

    function onDelete() {
        deleteData(count)
    }

    /**
     * Функция загрузки файла для существующего дела
     * @param {event} e 
     */

    function onUpload(e) {
        uploadFile(e.target.files[0]).then(snapshot => setToDoItem({
            ...toDoItem,
            filePath: snapshot 
        }))
        
        setTimeout(() => {
            setRandom(Math.random())
        }, 500)
    }

    /**
     * Функция удаления прикрепленного файла
     */

    function onDeleteFile() {
        setToDoItem({
            ...toDoItem,
            filePath: ""
        })
        setTimeout(() => {
            setRandom(Math.random())
        }, 200)
    }

    return (
        <li className="list-item" style = {{"backgroundColor": `${backgroundColor}`}}>
            <div className="list-item__delete" onClick={() => onDelete()}>&#10060;</div>
            <input type="text" className="list-item__number" value={count + 1} readOnly/>
            <div className="list-item__checkbox-wrap">
                <input className="list-item__checkbox" type="checkbox" defaultChecked={ended} onChange={e => endedChange(e)}/>
            </div>
            <input type="text" name="title" className="list-item__title" onChange={(e) => changeState(e)} defaultValue={title}/>
            <textarea type="text" name="description" className="list-item__descr" onChange={(e) => changeState(e)} value={description}/>
            <input type="date" name="endDate" className="list-item__date" onChange={(e) => changeState(e)} value={endDate}/>
            <div className='list-item__file'>
                {toDoItem.filePath !== "" ? 
                    <>
                        <img className='list-item__img' src={toDoItem.filePath} alt="file" />
                        <div onClick={() => onDeleteFile()} className="list-item__delete-file">&#10060;</div>
                    </> 
                : 
                    <input type="file" accept=".jpg, .jpeg, .png" onChange={e => onUpload(e)}/>}
            </div>
        </li>
    )
}

export default ToDoListItem
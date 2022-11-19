import './addToDoItem.css'
import { useState, useEffect, useRef } from 'react'
import useFetch from '../services/server';

/**
 * Компонент добавления нового дела в список
 * @type
 */

const AddToDoItem = () => {
    const [newItem, setNewItem] = useState(null);
    const [counter, setCounter] = useState(null);
    const file = useRef(null)

    const {changeData, fetchData, uploadFile} = useFetch();

    

    useEffect(() => {
        fetchData((snapshot) => {
            setCounter([...snapshot.val()].length)
        })
        setNewItem({
            filePath: ""
        })
        // eslint-disable-next-line
    }, [])

    /**
     * Функция записи информации в состояние при изменении полей 
     * @param {event} e 
     */

    function newItemState(e) {
        const key = e.target.getAttribute('name')
        setNewItem({
            ...newItem,
            ended: false,
            [key]: e.target.value
        })
    }

    /**
     * Функция добавлениянового дела в базу данных, сброса формы и установления filePath в дефолтное значение ("")
     * @param {event} e 
     */

    function submit(e) {
        e.preventDefault();
        setCounter(counter => (counter + 1))
        changeData(newItem, counter);
        e.target.reset();
        setNewItem({
            filePath: ""
        })
    }

    /**
     * Функция загрузки пркрепленного файла на сервер и установки пути к файлу в filePath
     * @param {event} e 
     */

    function onUpload(e) {
        uploadFile(e.target.files[0]).then(snapshot => {
            
            setNewItem({
                ...newItem,
                filePath: snapshot
            })
        });
    }

    /**
     * Функция удаления прикрепленного файла
     */

    function onDeleteFile() {
        setNewItem({
            ...newItem,
            filePath: ""
        })
    }

    return (
        <>
            <div>
                <form onSubmit={submit}>
                    <div className="form">
                        <input name="title" className='form__title' type="text" placeholder="Input business title" onChange={newItemState} required/>
                        <textarea name="description" className='form__descr' type="text" placeholder="Input business description" onChange={newItemState} required/>
                        <input name="endDate" className='form__date' type="date" placeholder="Input due date" onChange={newItemState} required/>
                        <div className='form__file'>
                            {newItem && newItem.filePath !== "" ?
                                <>
                                    <img ref={file} accept=".jpg, .jpeg, .png" className='form__photo' src={newItem.filePath} alt="file" /> 
                                    <div onClick={() => onDeleteFile()} className="form__delete-file">&#10060;</div>
                                </>
                                
                            : 
                                <input type="file" accept=".jpg, .jpeg, .png" onChange={e => onUpload(e)}/>}
                        </div>
                        
                    </div>
                    <button className='form__submit' type="submit">Submit</button>
                </form>
                
            </div>
        </>
    )
}

export default AddToDoItem
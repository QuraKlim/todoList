import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getStorage, uploadBytes, ref as storageRef, getDownloadURL } from "firebase/storage";

/**
 * Функция для общения с базой данных и хранилищем
 * @returns {{fetchData, changeData, deleteData, uploadFile}} Функции общения - fetchData(запрос списка дел) changeData(изменение дела) deleteData(удаление дела) uploadFile(загрузка прикрепленного файла)
 */

const useFetch = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDSsQK0sahcygyHx5cDftK1QRf1_8L-L34",
    authDomain: "womanup-d732b.firebaseapp.com",
    projectId: "womanup-d732b",
    storageBucket: "womanup-d732b.appspot.com",
    messagingSenderId: "378395171552",
    appId: "1:378395171552:web:688e5b6f933122bea24e85",
    databaseURL: "https://womanup-d732b-default-rtdb.europe-west1.firebasedatabase.app/"
  };
  
  const app = initializeApp(firebaseConfig);
  
  /**
   * Функция обращения к базе данных для извлчения списка дел 
   * @param {function} callback Функция, принимающая в себя снимок базы данных для трансформации
   */
  const fetchData = (callback) => {
    const db = getDatabase(app);
    const link = ref(db, 'list');
    onValue(link, callback)
  }
  
  /**
   * Функция изменения данных в базе по адресу "list/{count}"
   * @param {{}} data Объект с обязательными ключами "title", "description", "filePath" (строка, как минимум пустая), 'endDate'(дата в виде "полный год-месяц-день"), ended (boolean)
   * @param {number} count Номер дела, которое должео измениться (начиная с 0)
   */
  const changeData = (data, count) => {
    const db = getDatabase(app);
    const link = ref(db, `list/${count}/`);
    set(link, data)
  }

  /**
   * Функция удаления дела путем полной перезаписи списка дел в базе данных
   * @param {number} count Номер дела, которое нужно удалить (начиная с 0)
   */

  function deleteData(count) {
    let newArr
    fetchData(snapshot => {
      const resp = [...snapshot.val()]
      const newData = resp.filter((i, counter) => {
        return count !== counter
      })
      newArr = {...newData}
      return newArr
    })
    console.log(newArr)
    const db = getDatabase(app);
    const link = ref(db, `list`);
    set(link, newArr)
  }

  /**
   * Функция загрузки прикрепляемого файла в хранилище Firebase
   * @param {{}} data Объект картинки, возвращаемый от File API 
   * @returns {Promise} В then передаётся путь к загруженной картиинке
   */

  const uploadFile = async (data) => {
    const storage = getStorage(app);
    const fileRef = await storageRef(storage, `files/${data.name}`);
    await uploadBytes(fileRef, data)
    const fullFileRef = await getDownloadURL(storageRef(storage, `files/${data.name}`))
    return fullFileRef
  }

  return {fetchData, changeData, deleteData, uploadFile}
}

export default useFetch;
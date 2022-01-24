import axios from 'axios';

const getAll = (url) => axios.get(url);

const getById = (url, id) => axios.get(`${url}/${id}`);

const addObj = (url, obj) => axios.post(url, obj);

const updateObj = (url, id, obj) => axios.put(`${url}/${id}`, obj);

const deleteObj = (url, id) => axios.delete(`${url}/${id}`);

const getUserFullData = async (urlUsers, urlTodos, urlPosts, userId) => {
    try {
        const user = await getById(urlUsers, userId);

        const userTodos = await getAll(`${urlTodos}?userId=${userId}`);
        // option 1
        const top5Todos = userTodos.data.slice(0, 5).map(todo => todo.title);
        // option 2
        // const top5Todos = userTodos.data.slice(0, 5)
        // const todosTitles = top5Todos.map(todo => todo.title);

        const userPosts = await getAll(`${urlPosts}?userId=${userId}`);
        const firstPost = userPosts.data[0].title;

        return {
            name: user.data.name,
            email: user.data.email,
            todos: top5Todos,
            post: firstPost
        }
    } catch (error) {
        console.log(error)
    }
}

// const urlUsers = "https://jsonplaceholder.typicode.com/users";
// const urlTodos = "https://jsonplaceholder.typicode.com/todos";
// const urlPosts = "https://jsonplaceholder.typicode.com/posts";

// getUserFullData(urlUsers, urlTodos, urlPosts, 1).then(data => console.log(data)).catch(e => console.log(e))

export { getAll, getById, addObj, updateObj, deleteObj, getUserFullData };
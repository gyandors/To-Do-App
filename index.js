const form = document.getElementById('todo');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  //Grab the values of input fields
  const todoName = event.target.todoName.value;
  const todoDesc = event.target.todoDesc.value;

  //Create the object of inputs
  const obj = { todoName, todoDesc, isDone: false };

  //Add the object in the server database using HTTP POST request
  axios
    .post('https://crudcrud.com/api/d68f4732d5eb417db448e3bedb998fab/ToDo', obj)
    .then((result) => {
      incompleteToDos(obj);
      alert('To-Do added');
    })
    .catch((error) => {
      console.log(error);
    });

  //Clear the input fields
  document.getElementById('todoName').value = '';
  document.getElementById('todoDesc').value = '';
});

//Show the list of incomplete and completed To-Do's
window.addEventListener('DOMContentLoaded', () => {
  axios
    .get('https://crudcrud.com/api/d68f4732d5eb417db448e3bedb998fab/ToDo')
    .then((result) => {
      const todoArray = result.data;
      for (let val of todoArray) {
        if (val.isDone == false) incompleteToDos(val);
        else completedToDos(val);
      }
    })
    .catch((error) => {
      alert('Requests limit over');
    });
});

function incompleteToDos(obj) {
  const incomplete = document.getElementById('incomplete');

  const list = document.createElement('li');
  incomplete.appendChild(list);
  list.innerHTML = `${obj.todoName}: &nbsp ${obj.todoDesc} `;
  list.className = 'todo-list';

  const doneBtn = document.createElement('button');
  list.appendChild(doneBtn);
  doneBtn.innerHTML = '&#10004';
  doneBtn.className = 'btn';
  doneBtn.addEventListener('click', () => {
    incomplete.removeChild(doneBtn.parentElement);
    axios
      .put(
        `https://crudcrud.com/api/d68f4732d5eb417db448e3bedb998fab/ToDo/${obj._id}`,
        {
          todoName: obj.todoName,
          todoDesc: obj.todoDesc,
          isDone: true,
        }
      )
      .then((result) => {
        completedToDos(obj);
        alert('To-Do is marked as done');
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const delBtn = document.createElement('button');
  list.appendChild(delBtn);
  delBtn.innerHTML = '&#10008';
  delBtn.className = 'btn';
  delBtn.onclick = () => {
    incomplete.removeChild(delBtn.parentElement);
    axios
      .delete(
        `https://crudcrud.com/api/d68f4732d5eb417db448e3bedb998fab/ToDo/${obj._id}`
      )
      .then((result) => {
        alert('To-Do deleted');
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

function completedToDos(obj) {
  const completed = document.getElementById('completed');
  const list = document.createElement('li');
  completed.appendChild(list);
  list.innerHTML = `${obj.todoName}: &nbsp ${obj.todoDesc} `;
  list.className = 'todo-list';
}

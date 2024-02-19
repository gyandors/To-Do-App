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
    .post('https://crudcrud.com/api/8b30063c843e4ac78b14669688a23de4/ToDo', obj)
    .then((result) => {
      alert('To-Do added');
    })
    .catch((error) => {
      console.log(error);
    });

  incompleteToDos(obj);

  //Clear the input fields
  document.getElementById('todoName').value = '';
  document.getElementById('todoDesc').value = '';
});

//Show the list of incomplete and completed To-Do's
window.addEventListener('DOMContentLoaded', () => {
  axios
    .get('https://crudcrud.com/api/8b30063c843e4ac78b14669688a23de4/ToDo')
    .then((result) => {
      const todoArray = result.data;
      for (let val of todoArray) {
        if (val.isDone == false) incompleteToDos(val);
        else completedToDo(val);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

function incompleteToDos(obj) {
  const incomplete = document.getElementById('incomplete');

  const list = document.createElement('li');
  list.innerHTML = `${obj.todoName}: &nbsp ${obj.todoDesc} `;

  const doneBtn = document.createElement('button');
  doneBtn.innerHTML = '&#10004';
  doneBtn.addEventListener('click', () => {
    incomplete.removeChild(doneBtn.parentElement);
    axios
      .put(
        `https://crudcrud.com/api/8b30063c843e4ac78b14669688a23de4/ToDo/${obj._id}`,
        {
          todoName: obj.todoName,
          todoDesc: obj.todoDesc,
          isDone: true,
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });

    completedToDo(obj);
  });
  list.appendChild(doneBtn);

  const delBtn = document.createElement('button');
  delBtn.innerHTML = '&#10008';
  delBtn.addEventListener('click', () => {
    incomplete.removeChild(delBtn.parentElement);
    axios
      .delete(
        `https://crudcrud.com/api/8b30063c843e4ac78b14669688a23de4/ToDo/${obj._id}`
      )
      .then((result) => {
        alert('To-Do deleted');
      })
      .catch((err) => {
        console.log(err);
      });
  });
  list.appendChild(delBtn);

  incomplete.appendChild(list);
}

function completedToDo(obj) {
  const completed = document.getElementById('completed');
  const list = document.createElement('li');
  list.innerHTML = `${obj.todoName}: &nbsp ${obj.todoDesc} `;
  completed.appendChild(list);
}

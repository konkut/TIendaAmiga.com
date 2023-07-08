import {saveTask, getTasks, onGetTasks,deleteTask, getTask, updateTask, uploadFile, queryTasks, onSnapshot} from './firebase.js';

const taskForm = document.getElementById('task-form');  //DOM formulario 
const taskContainer = document.getElementById('task-container');
const taskSearch = document.getElementById('task-search');  
const btnAdd = document.querySelector('#btn-add');
const formAddEdit = document.querySelector('#form-add-edit');
const btnEdit = document.querySelector('.btn-edit');


let task;
let editStatus = false;
let id;
let html;
let queryData;

window.addEventListener('DOMContentLoaded', async (e)=>{
    
    //primera forma sin actualizarse automaticamente los datos
    /*
    const querySnapshot = await getTasks();
    console.log(querySnapshot);
    let html = '';
    querySnapshot.forEach(docs => {
        //console.log(docs.id);    
        //console.log(docs.data());
        let task = docs.data();
        html += `
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <button class="btn-delete" data-id="${docs.id}">Delete</button>
            </div>    
        `;
    });
    taskContainer.innerHTML = html;
    */
    //segunda forma con actualizacion automaticamente los datos
   
    onGetTasks((querySnapshot)=>{
        reloadTask(querySnapshot);
    });
})

let imageChange;
taskForm['task-file'].addEventListener('change',(e)=>{
    imageChange = e.target.files[0]; 
});

taskSearch.addEventListener('input',async (e)=>{
    queryData = await queryTasks(taskSearch.value);
    if(taskSearch.value !=''){
        taskContainer.innerHTML = '';
        onSnapshot(queryData,(snapshot)=>{
            reloadTask(snapshot);
        })
        console.log('ingreso query');
    }
    if(taskSearch.value ==''){
        taskContainer.innerHTML = '';
        onGetTasks((querySnapshot)=>{
            reloadTask(querySnapshot);
        });
        console.log('ingreso total');
    }
});


taskForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    try{
        const title = taskForm['task-title'];  //etiqueta input formulario
        const description = taskForm['task-description'];   //etiqueta textarea formulario
        const resultURL = await uploadFile(imageChange);
        if(!editStatus){
            saveTask(title.value, description.value, resultURL);
        }else{
            updateTask(id,{title: title.value, description: description.value, image: resultURL});
            editStatus = false;
            taskForm['btn-task-save'].innerHTML = 'Agregar';
        }
        taskForm.reset();
        onGetTasks((querySnapshot)=>{
            reloadTask(querySnapshot);
        });
        formAddEdit.setAttribute('hidden','true');
    }catch(error){
        console.log(error);
        alert('fallo interno intente mas tarde');
    }
    
})
const reloadTask=(querySnapshot)=>{
    //Mostrar tareas
    html = '';
    querySnapshot.forEach(docs => {
        task = docs.data();
        html += `
            <div class="bg-slate-600 rounded-sm">
                <div class="flex p-2 justify-center items-center w-full text-slate-300 mt-4 md:mt-0">
                    <div class="px-4">
                        <h3 class="text-lg block"><b class="font-bold text-slate-100">Producto:</b> ${task.title}</h3>
                        <p class="block"><b class="font-bold text-slate-100">Precio:</b> ${task.description}</p>
                    </div>
                    <div class="w-24 h-24 rounded-full">
                        <img class="w-full h-full" src="${task.image}" alt="">
                    </div>
                </div>
                <div class="flex justify-center items-center w-full">
                    <button class="btn-delete bg-pink-600 hover:bg-pink-800 py-1 rounded-sm text-slate-300 text-center w-1/2 text-sm" data-id="${docs.id}">Borrar</button>
                    <button class="btn-edit bg-blue-600 hover:bg-blue-800 py-1 rounded-sm text-slate-300 text-center w-1/2  text-sm" data-id="${docs.id}">Modificar</button>
                </div>                    
            </div>    
        `;
    });
    taskContainer.innerHTML = html;

    //ELiminar tareas
    const btnsDelete = taskContainer.querySelectorAll('.btn-delete');
    btnsDelete.forEach(btn =>{
        btn.addEventListener('click', ({target: {dataset}}) =>{
            deleteTask(dataset.id);
        })
    });

    //Editar tareas
    const btnsEdit = taskContainer.querySelectorAll('.btn-edit');
    btnsEdit.forEach(btn =>{
        btn.addEventListener('click', async (e) =>{
            formAddEdit.removeAttribute('hidden');
            const doc = await getTask(e.target.dataset.id);
            task = doc.data();
            taskForm['task-title'].value = task.title;
            taskForm['task-description'].value = task.description;
            editStatus = true;
            id = doc.id;
            taskForm['btn-task-save'].innerHTML = 'Modificar';
        })
    });
}
document.addEventListener('click',e=>{
    console.log(e.target);
    if(e.target.matches('#btn-add')){
        formAddEdit.removeAttribute('hidden');    
    }
    if(e.target.matches('body')){
        formAddEdit.setAttribute('hidden','true');    
    }
    if(e.target.matches('.grid')){
        formAddEdit.setAttribute('hidden','true');    
    }
    if(e.target.matches('#task-search')){
        formAddEdit.setAttribute('hidden','true');    
    }
    if(e.target.matches('h1')){
        formAddEdit.setAttribute('hidden','true');    
    }
   
    
})





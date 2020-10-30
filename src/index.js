const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

//Usar JSON como padrão.
app.use(express.json());
/**
 * Método HTTP:
 *
 * GET: buscar informações do back-end.
 * POST: criar uma informação no back-end.
 * PUT/PATCH: Alterar uma informação no back-end.
 * DELETE: Deletar uma informação no back-end.
 */

/**
 * QUERYP PARAMS: Filtros e paginação.
 * ROUTE PARAMS: Identificar recurso na hora de deletar ou atualizar.
 * RESQUEST BODY: Conteúdo na hora e criar e editar um recurso (JSON).
 */

/**
 * Middleware: Interceptador de requisições que pode interromper totalmente a requisição ou alterar dados da requisição.
 */

const projects = [];

function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    next(); //usar quando não quiser interromper o fluxo da operação(chama a rota).

}

function validateProjectId(request, response, next) {
    const { id } = request.params;

    console.log(id)

    if(!isUuid(id)) {
        return response.status(400).json({ error: 'Invelid project ID.'});
    }

    return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
    const { title} = request.query;

    const results = title
        ? projects.filter( project => project.title.includes(title))
        : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error: "Project not found."});
    }

    const project = {
        id,
        title,
        owner
    }

    projects[projectIndex] = project;
    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {

    const { id } = request.params;
    const projectIndex = projects.findIndex(project => project.id === id);

    if(projectIndex < 0){
        return response.status(400).json({error: "Project not found."});
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('🚀 Back-end started!');
});

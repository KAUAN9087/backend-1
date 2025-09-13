import fastify from "fastify"
import crypto from "node:crypto"

const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            }
        }
    }
})

const cursos = [
    { id: '1', title: 'Curso de Node.js'},
    { id: '2', title: 'Curso de React'},
    { id: '3', title: 'Curso de React Native'},
]

server.get('/cursos', () => {
    return { cursos }
})

server.get('/cursos/:id', (request, reply) => {
    type params = {
        id: string
    }

    const params = request.params as params
    const cursosId = params.id

    const curso = cursos.find(curso => curso.id === cursosId)

    if(curso) {
        return { curso}
    }

    return reply.status(404).send()
})

server.post('/cursos', (request, reply) => {
    type body = {
        title: string
    }

    const cursoId = crypto.randomUUID()

    const body = request.body as body
    const cursoTitle = body.title

    if(!cursoTitle) {
        return reply.status(400).send({ message: 'Titulo obrigatório.'})
    }

    cursos.push({ id: cursoId, title: cursoTitle })

    return reply.status(201).send({ cursoId})
})

server.listen({ port: 3333}).then(() => {
    console.log('servidor rodando na porta 3333')
})
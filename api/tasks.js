const moment = require('moment');

module.exports = app => {
    
    const getTasks = (req, res) => {
        const date = req.query.date ? req.query.date : moment().endOf('day').toDate();

        app.db('tasks')
            .where({ userId: req.user.id })
            .where('estimateAt', '<=', date)
            .orderBy('estimateAt')
            .then(tasks => res.status(200).json(tasks))
            .catch(err => res.status(400).json({ message: 'Error', err }));
    }

    const save = (req, res) => {
        const { desc } = req.body;

        if (!desc.trim()) {
            return res.status(400).json({ message: 'Descrição é um campo obrigatário!' });
        }

        req.body.userId = req.user.id;

        app.db('tasks')
            .insert(req.body)
            .then(_ => res.status(200).json({ message: 'Success!' }))
            .catch(err => res.status(400).json({ message: 'Dados inválidos!', err }));
    }

    const remove = (req, res) => {
        const { id } = req.params;
        const { id: userId } = req.user;
        
        app.db('tasks')
        .where({ id, userId })
        .del()
        .then(rowsDeleted => {
            if (rowsDeleted !== 0) {
                res.status(204).json();
            } else {
                const message = `No user found with id ${id}.`;
                res.status(400).json({ message });
            }
        })
        .catch(err => res.status(400).json({ message: 'Error on delete data!', err }));
        
    }
    
    const updateTaskDoneAt = (req, res, doneAt) => {
        const { id } = req.params;
        const { id: userId } = req.user;
        
        app.db('tasks')
            .where({ id, userId })
            .update({ doneAt })
            .then(_ => res.status(204).json({ message: 'Success!' }))
            .catch(err => res.status(400).json({ message: 'Error with the update', err }));
    }
    
    const toogleTask = (req, res) => {
        const { id } = req.params;
        const { id: userId } = req.user;

        app.db('tasks')
            .where({ id, userId })
            .first()
            .then(task => {
                if (!task) {
                    const message = `No task found with id: ${id}`;
                    return res.status(400).json({ message });
                }

                const doneAt = task.doneAt ? null : new Date();
                updateTaskDoneAt(req, res, doneAt); // Update database
            })
            .catch(err => res.status(400).json({ message: 'Error', err }));
    }

    return { getTasks, save, remove, toogleTask };
};

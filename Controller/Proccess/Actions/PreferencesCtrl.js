const { createUseTime, updateUseTime } = require('../../Databases/CRUD-Preferences')

const useTimePreference = async (id, data) => {
  let useTime = { error: true }

  if (id) {
    await updateUseTime({ id }, data)
    useTime = data
  } else {
    useTime = await createUseTime(data)
    delete useTime.id
  }

  return { useTime }
}

module.exports = { useTimePreference }

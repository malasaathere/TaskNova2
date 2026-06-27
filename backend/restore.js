const { sequelize } = require('./src/config/database');
const models = require('./src/models');
const fs = require('fs');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to target DB.');
    
    // Sync force to clean the DB
    await sequelize.sync({ force: true });
    
    const data = JSON.parse(fs.readFileSync('backup.json', 'utf8'));
    
    // The order of insertion matters due to foreign keys!
    const order = ['User', 'Project', 'Task', 'Comment', 'Notification', 'Attachment', 'Otp'];
    
    for (const name of order) {
      if (data[name] && data[name].length > 0) {
        console.log(`Restoring ${data[name].length} rows for ${name}...`);
        await models[name].bulkCreate(data[name], {
          hooks: false,
          ignoreDuplicates: true
        });
        
        // Update PostgreSQL sequence so future inserts don't fail due to id conflicts
        // This assumes the primary key is 'id' and table names are correctly guessed by Sequelize.
        const tableName = models[name].tableName;
        try {
          const [[{max}]] = await sequelize.query(`SELECT MAX(id) as max FROM "${tableName}";`);
          if (max) {
             await sequelize.query(`SELECT setval('"${tableName}_id_seq"', ${max});`);
          }
        } catch (e) {
          // It's okay if sequence update fails (e.g., table not using standard seq)
        }
      }
    }
    console.log('Restore successful!');
    process.exit(0);
  } catch (err) {
    console.error('Error restoring:', err);
    process.exit(1);
  }
})();

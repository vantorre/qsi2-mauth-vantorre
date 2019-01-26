module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define(
        'Group',
        {
            id: {
                // Avoid usage of auto-increment numbers, UUID is a better choice
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                comment: 'Group ID',
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                comment: 'Group title',
                // setter to standardize
                set(val) {
                    this.setDataValue(
                        'title',
                        val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
                    );
                }
            },
            description: {
                type: DataTypes.STRING,
                comment: 'Group description',
                // setter to standardize
                set(val) {
                    this.setDataValue(
                        'description',
                        val.charAt(0).toUpperCase() + val.substring(1).toLowerCase()
                    );
                }
            },
            metadatas: {
                type: DataTypes.JSON,
                // Not null management
                allowNull: true,
                comment: 'Group metadatas'
            }
        },
        {
            // logical delete over physical delete
            paranoid: true
        }
    );

    Group.associate = models => {
        Group.belongsToMany(models.Users, { through: 'Member' });
    };

    return Group;
};

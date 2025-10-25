module.exports = (sequelize, DataTypes) => {
  const OTPVerification = sequelize.define('OTPVerification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    otp_code: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('registration', 'password_reset', '2fa'),
      defaultValue: 'registration'
    }
  }, {
    tableName: 'otp_verifications',
    indexes: [
      { fields: ['email'] },
      { fields: ['otp_code'] },
      { fields: ['expires_at'] },
      { fields: ['is_used'] },
      { fields: ['type'] }
    ]
  });

  return OTPVerification;
};
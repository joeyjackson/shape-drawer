mongosh -- "$MONGO_INITDB_DATABASE" <<EOF
  var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
  var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
  var admin = db.getSiblingDB('admin');
  admin.auth(rootUser, rootPassword);
  
  var authSource = '$MONGO_AUTH_SOURCE';
  db = db.getSiblingDB(authSource);
  var user = '$MONGO_USER';
  var passwd = '$MONGO_PASSWORD';
  db.createUser({user: user, pwd: passwd, roles: ["readWrite"]});
EOF

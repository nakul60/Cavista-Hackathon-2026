from app import create_app, db
from app.models import User, EMR

app = create_app()

# In this current context run this app
with app.app_context():
    # Now when all the python classes are defined, we can create the database
    db.create_all()
    
if __name__ == '__main__':
    # app.run means start the server and debug=True means that show errors if any
    app.run(debug=True)
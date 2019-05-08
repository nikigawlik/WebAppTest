from flask import Flask
from flask import render_template
from flask import g
import os
from election_stats.model import Region, RegionType, Party, Result, get_engine
from sqlalchemy.orm import sessionmaker

VERSION = "v1.0"

tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
print(tmpl_dir)
app = Flask(__name__, template_folder=tmpl_dir)

# configure SQLAlchemy
engine = get_engine()
Session = sessionmaker(bind=engine)

@app.route('/')
def hello():
	engine = get_engine()
	session = Session()
	states = [state for state in session.query(Region).filter_by(regionType = RegionType.state).order_by(Region.name)]
	session.commit()
	
	# we render the states server side, so that they appear instantaneously
	return render_template('main.html', states = states)

@app.route('/districts/', methods=['GET'])
def get_districts():
	pass

@app.teardown_appcontext
def close_db(error):
	if hasattr(g, 'sqlite_db'):
		g.sqlite_db.close()
	
app.run(debug = True)
from flask import Flask, Blueprint, render_template, request, redirect, url_for, session, jsonify , make_response

app = Flask(__name__)
app.secret_key = 'your_secret_key'

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template('home.html')

users={}
@main.route('/register ', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        # Render the signup page if accessed via GET
        return render_template('register.html')

    # Handle POST request (form submission)
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    username = data.get('username')
    email = data.get('email')
    telephone = data.get('telephone')
    country = data.get('country')
    password = data.get('password')

    # Validate if email or username already exists
    if email in users or any(user['username'] == username for user in users.values()):
        # Pass a message back to the signup template
        return render_template('register.html', message="Email or username already exists.")
    else:
        # Save the new user's data
        users[email] = {
            'username': username,
            'email': email,
            'telephone': telephone,
            'country': country,
            'password': password
        }
        # Redirect to login page on successful signup
        return render_template('login.html')


@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')

    if request.is_json:
        data = request.get_json()
    else:
        data = request.form

    identifier = data.get('identifier')  # Can be username or email
    password = data.get('password')

    # Find user by username or email
    user = next((user for user in users.values() if user['email'] == identifier or user['username'] == identifier), None)

    if user and user['password'] == password:
        # Set both email and username cookies
        response = make_response(redirect(url_for('main.choose')))
        response.set_cookie('email', user['email'])
        response.set_cookie('username', user['username'])
        return response
    else:
        return render_template('login.html', message="Invalid credentials. Please try again.")
        

    @main.route('/profile')
    def profile():
        users = {
    "user@example.com": {
        "id": 1193,
        "name": "Asala Ahmed",
        "description": "She is a young girl who urgently needs a heart transplant due to a serious medical condition",
        "email": "AsalaAhmed@gmail.com",
        "password": "A$221225",
        "phoneNumbers": ["01234567890", "01198765432"],
        "anotherPhone": "01198765432",
        "dob": "22/12/2005",
        "address": "Flowers Street, 6 October",
        "status": "Patient",
    }
}
        email = session.get('email', 'user@example.com')  # Use session to identify logged-in user
    user = users.get(email)

    if not user:
        return redirect(url_for('register'))  # Redirect to registration page if no user is found

    return render_template('profile.html', user=user)

@main.route('/api/user-data', methods=['GET'])
def get_user_data():
    email = session.get('email', 'user@example.com')  # Use session for logged-in user
    user = users.get(email)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify(user)

@main.route('/choose')
def choose():
    
    return render_template('choose.html')

@main.route('/donor', methods=['GET', 'POST'])
def donor():
    if request.method == 'POST':
        data = request.get_json()

        name = data.get('name')
        blood_type = data.get('blood_type')
        organ_donated = data.get('organ_donated')
        contact_info = data.get('contact_info')

        if not all([name, blood_type, organ_donated, contact_info]):
            return jsonify({"message": "All fields are required!"}), 400

        # Log donor data (or save to local storage)
        print(f"Name: {name}, Blood Type: {blood_type}, Organ Donated: {organ_donated}, Contact Info: {contact_info}")

        return jsonify({"message": "Donor data submitted successfully!"}), 200
    return render_template('donor.html')
    return redirect(url_for('records'))

@main.route('/patient', methods=['GET', 'POST'])
def patient():
    if request.method == "POST":
        # Get form data from the request
        data = request.get_json()
        name = data.get('name')
        gender = data.get('gender')
        birthday = data.get('birthday')
        email = data.get('email')
        phone = data.get('phone')
        address = data.get('address')
        organ_needed = data.get('organ_needed')
        health_status = data.get('health_status')

        # Check if all required fields are provided
        if not all([name, gender, birthday, email, phone, address, organ_needed, health_status]):
            return jsonify({"message": "All fields are required!"}), 400

        # Print the submitted data for debugging purposes
        print(f"Name: {name}, Gender: {gender}, Birthday: {birthday}, Email: {email}, "
              f"Phone: {phone}, Address: {address}, Organ Needed: {organ_needed}, Health Status: {health_status}")

        # Redirect to the profile page after successful submission
        return redirect(url_for('main.profile'))

    # Render the patient form page if the method is GET
    return render_template('patient.html')
    

@main.route('/records')
def records():
    return render_template('records.html')

app.register_blueprint(main)

if __name__ == '__main__':
    app.run(debug=True)
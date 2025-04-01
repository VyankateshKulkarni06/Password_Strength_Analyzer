from pymongo import MongoClient

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["Password_Analyzer"]  # Database name
collection = db["pwned_passwords"]  # Collection name (change if needed)

# File path
file_path = r"C:\Users\user\pwnedpasswords.txt"

# Batch settings
batch_size = 100000  # Insert in batches of 100K records
batch = []

# Read file line by line``
with open(file_path, "r", encoding="utf-8") as file:
    for line in file:
        line = line.strip()
        if not line:
            continue  # Skip empty lines
        
        try:
            password_hash, count = line.split(":")  # Extract hash & count
            batch.append({"hash": password_hash, "count": int(count)})

            # Insert batch into MongoDB
            if len(batch) >= batch_size:
                collection.insert_many(batch)
                print(f"Inserted {len(batch)} records...")
                batch = []  # Clear batch

        except ValueError:
            print(f"Skipping invalid line: {line}")

# Insert remaining records
if batch:
    collection.insert_many(batch)
    print(f"Inserted last {len(batch)} records...")

print("All data inserted successfully!")

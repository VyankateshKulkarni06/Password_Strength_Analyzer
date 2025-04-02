import pymongo 
from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["Password_Analyzer"]
pwned_collection = db["pwned_passwords"]
ngrams_collection = db["passwordngram_1s"]

# Function to generate n-grams
def generate_ngrams(hash_str, n=4):
    """Generate a set of n-grams from a given string."""
    if not isinstance(hash_str, str):
        return set()
    if len(hash_str) < n:
        return set()
    return {hash_str[i:i + n] for i in range(len(hash_str) - n + 1)}

# Batch insert size for efficiency
BATCH_SIZE = 10000

def process_pwned_passwords():
    """Fetch passwords from pwned_passwords, generate n-grams, and insert into passwordngram_1s."""
    cursor = pwned_collection.find({}, {"_id": 1, "hash": 1})
    batch = []
    
    total_documents = pwned_collection.count_documents({})
    print(f"Total documents to process: {total_documents}")
    
    processed_count = 0

    for doc in cursor:
        processed_count += 1
        print(f"Processing document {processed_count}/{total_documents}: {doc}")
        password_id = doc.get("_id")
        hash_value = doc.get("hash", "")
        
        if not hash_value:
            print(f"Skipping document {password_id} because 'hash' is missing or empty.")
            continue

        # Generate n-grams for the password hash
        ngrams = generate_ngrams(hash_value, 4)
        print(f"Password ID: {password_id}, generated n-grams: {ngrams}")
        
        # Prepare the batch for insertion
        for ngram in ngrams:
            batch.append({
                "ngram": ngram,
                "passwordId": password_id
            })
        
        # Insert in batches for efficiency
        if len(batch) >= BATCH_SIZE:
            print(f"Inserting batch of {len(batch)} n-grams...")
            try:
                result = ngrams_collection.insert_many(batch)
                print(f"Inserted {len(result.inserted_ids)} n-grams.")
            except Exception as e:
                print(f"Error inserting batch: {e}")
            batch.clear()  # Clear the batch after insertion

    # Insert any remaining documents
    if batch:
        print(f"Inserting final batch of {len(batch)} n-grams...")
        try:
            result = ngrams_collection.insert_many(batch)
            print(f"Inserted {len(result.inserted_ids)} n-grams.")
        except Exception as e:
            print(f"Error inserting final batch: {e}")

    print("🎉 Conversion completed successfully!")

if __name__ == "__main__":
    process_pwned_passwords()

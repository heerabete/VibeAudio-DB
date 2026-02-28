import json

# Bhai, ye function numbers ko words mein convert karega (e.g. 150 -> One Hundred Fifty)
def num_to_words(num):
    ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
    tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
    
    if num < 20:
        return ones[num]
    elif num < 100:
        return tens[num // 10] + ('' if num % 10 == 0 else '-' + ones[num % 10])
    elif num < 1000:
        return ones[num // 100] + ' Hundred' + ('' if num % 100 == 0 else ' ' + num_to_words(num % 100))
    return str(num)

# Ye function din ke hisaab se Mahina (Section) decide karega
def get_section(day):
    if day <= 31: return "January"
    elif day <= 59: return "February"
    elif day <= 90: return "March"
    elif day <= 120: return "April"
    elif day <= 151: return "May"
    elif day <= 181: return "June"
    elif day <= 212: return "July"
    elif day <= 243: return "August"
    elif day <= 273: return "September"
    elif day <= 304: return "October"
    elif day <= 334: return "November"
    elif day <= 365: return "December"
    else: return "Bonus Content" # Jo 365 ke upar 382 tak jayenge unke liye!

# Main Automation Logic
def build_master_json():
    print("🚀 VibeOS Data Injector Started...")
    
    try:
        # Step 1: Tera kachha (raw) target.json read karo
        with open('target.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        final_data = []
        
        # Step 2: Har object mein magic inject karo
        for index, item in enumerate(data):
            chapter_num = index + 1
            
            # Naya format ready ho raha hai
            new_item = {
                "section": get_section(chapter_num),
                "name": f"Chapter {chapter_num}: Chapter {num_to_words(chapter_num)}",
                "url": item.get('url', item.get('url', 'URL_MISSING')) # Ensure kar URL fail na ho
            }
            final_data.append(new_item)
            
        # Step 3: Pakka hua maal final_vibe.json mein save kar do
        with open('final_vibe.json', 'w', encoding='utf-8') as f:
            json.dump(final_data, f, indent=2, ensure_ascii=False)
            
        print(f"✅ Ekdum Bawaal! {len(final_data)} chapters inject karke 'final_vibe.json' ready hai.")
        
    except FileNotFoundError:
        print("❌ Oye! 'target.json' nahi mila. Pehle script ke folder mein JSON file bana le!")

if __name__ == "__main__":
    build_master_json()
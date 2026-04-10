const url = "https://unfntxebtqctwrtjrdtq.supabase.co/storage/v1/object/public/files/fe8e0e6c-c6cc-4613-8fb1-e4028ce37286/1712711311021-x7vq8.pdf"; // Mock or generic public url, let's just make a generic call

async function test() {
  const reqUrl = `https://r.jina.ai/https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
  console.log("Fetching Jina AI...");
  const res = await fetch(reqUrl);
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Text length:", text.length);
  console.log(text.slice(0, 300));
}

test();

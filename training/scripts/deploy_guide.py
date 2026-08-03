#!/usr/bin/env python3
"""HopeAI LoRA -> GGUF 转换 & 手机部署"""
import sys

print("""=== HopeAI 模型部署 ===

**Step 1: 合并 LoRA 到 base model**
```bash
pip install transformers peft torch
python -c "
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import torch

base = AutoModelForCausalLM.from_pretrained('Qwen/Qwen2.5-0.5B-Instruct',
    torch_dtype=torch.float16, device_map='cpu')
model = PeftModel.from_pretrained(base, './hopeai_qwen05b_lora')
merged = model.merge_and_unload()
merged.save_pretrained('./merged_model')
AutoTokenizer.from_pretrained('Qwen/Qwen2.5-0.5B-Instruct').save_pretrained('./merged_model')
print('合并完成')
"
```

**Step 2: 转换为 GGUF**
```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release && make -j$(nproc)
cd ../..
pip install gguf
python llama.cpp/convert_hf_to_gguf.py ./merged_model --outfile hopeai_qwen05b.gguf --outtype q4_k_m
```

**Step 3: 部署到手机 (Termux)**
```bash
pkg update && pkg upgrade
pkg install git cmake make clang python
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp && mkdir build && cd build
cmake .. -DGGML_OPENMP=OFF -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)

# 推理
./bin/llama-cli -m /sdcard/Download/hopeai_qwen05b.gguf \\
  -p "<|im_start|>user\\n你好<|im_end|>\\n<|im_start|>assistant\\n" \\
  -n 256 --temp 0.7 -t 4
```

**Step 4: 用 HopeAI 调用**
```bash
python hopeai.py --web --model /sdcard/Download/hopeai_qwen05b.gguf
```

模型大小约 0.5B 参数，GGUF q4_k_m 约 350MB，手机可运行。
""")

import random
import csv

NUM_LOGS = 10000

modules = [
    "axi_controller","dma_engine","memory_controller","cache_controller",
    "fifo_buffer","alu_unit","uart_interface","spi_master",
    "arbiter_unit","power_manager","interrupt_controller",
    "pipeline_stage","decoder_unit","writeback_unit"
]

build_versions = ["v1.0","v1.1","v2.0","v2.1","v3.0"]

# -----------------------------
# Normal bug templates
# -----------------------------

bug_templates = {

    "timing_violation":[
        ("Timing violation detected between <*> and <*>",
         "Timing violation detected between clk_a and clk_b"),
        ("Setup time violation on signal <*>",
         "Setup time violation detected on signal data_in")
    ],

    "protocol_violation":[
        ("AXI handshake protocol violation in <*>",
         "AXI handshake protocol violation detected"),
        ("Invalid protocol state transition <*>",
         "Protocol state transition error detected")
    ],

    "memory_access_error":[
        ("Memory access out of bounds at address <*>",
         "Memory access out of bounds at address 0xFF12"),
        ("Illegal read access to <*>",
         "Read access to uninitialized memory region")
    ],

    "width_mismatch":[
        ("Bit width mismatch for signal <*>",
         "Bit width mismatch detected on signal assignment"),
        ("Signal width incompatible with <*>",
         "Signal width incompatible with destination register")
    ],

    "clock_domain_crossing":[
        ("Clock domain crossing without synchronizer <*>",
         "Clock domain crossing detected without synchronizer"),
        ("Unsafe signal transfer between <*> and <*>",
         "Unsafe signal transfer between asynchronous clocks")
    ],

    "assertion_failure":[
        ("Assertion failed: <*>",
         "Assertion failed: handshake protocol broken"),
        ("Assertion violation in FSM state <*>",
         "Assertion failed: FSM entered illegal state")
    ],

    "buffer_overflow":[
        ("FIFO buffer overflow at pointer <*>",
         "FIFO buffer overflow detected"),
        ("Buffer pointer exceeded limit <*>",
         "Buffer write pointer exceeded memory limit")
    ],

    "uninitialized_register":[
        ("Register <*> used before initialization",
         "Register used before initialization"),
        ("Reset signal missing for <*>",
         "Reset signal missing for register")
    ]
}

severity_map = {
    "timing_violation":"ERROR",
    "protocol_violation":"ERROR",
    "memory_access_error":"ERROR",
    "width_mismatch":"WARNING",
    "clock_domain_crossing":"WARNING",
    "assertion_failure":"ASSERT_FAIL",
    "buffer_overflow":"ERROR",
    "uninitialized_register":"WARNING"
}

# -----------------------------
# Rare failures (not in templates)
# -----------------------------

rare_failures = [
    "PLL lock failure detected in clock manager",
    "Voltage domain crossing violation detected",
    "Metastability detected in asynchronous register",
    "Clock gating failure detected in pipeline stage",
    "Bus arbitration deadlock detected",
]

# -----------------------------
# Unusual / corrupted logs
# -----------------------------

unusual_logs = [
    "ERROR: unexpected reset detected in module",
    "ASSERT_FAIL: invalid pipeline state detected",
    "FATAL: memory controller hang detected",
    "Unknown bus timeout error detected",
    "Simulation warning: unstable clock domain observed"
]

# -----------------------------
# Stack trace generator
# -----------------------------

def generate_stack_trace():

    signals = ["data_in","data_out","clk","rst","valid","ready","addr","write_en"]

    trace = []

    for _ in range(random.randint(2,4)):

        signal = random.choice(signals)
        value = random.randint(0,1)

        trace.append(f"signal={signal} value={value}")

    return " | ".join(trace)

# -----------------------------
# Normal log generator
# -----------------------------

def generate_normal_log(test_id):

    module = random.choice(modules)

    bug_type = random.choice(list(bug_templates.keys()))

    template, message = random.choice(bug_templates[bug_type])

    severity = severity_map[bug_type]

    timestamp = random.randint(10,5000)

    stack_trace = generate_stack_trace()

    log_message = (
        f"[SIM_TIME:{timestamp}ns] [{severity}] {module}\n"
        f"{message}\n"
        f"Trace: {stack_trace}"
    )

    anomaly = 1 if severity in ["ERROR","ASSERT_FAIL"] else 0

    return bug_type, severity, log_message, template, anomaly


# -----------------------------
# Rare failure generator
# -----------------------------

def generate_rare_log():

    module = random.choice(modules)

    message = random.choice(rare_failures)

    severity = "ERROR"

    stack_trace = generate_stack_trace()

    log_message = (
        f"[SIM_TIME:{random.randint(10,5000)}ns] [{severity}] {module}\n"
        f"{message}\n"
        f"Trace: {stack_trace}"
    )

    return "rare_failure", severity, log_message, "rare_template", 1


# -----------------------------
# Unusual log generator
# -----------------------------

def generate_unusual_log():

    module = random.choice(modules)

    message = random.choice(unusual_logs)

    severity = "WARNING"

    stack_trace = generate_stack_trace()

    log_message = (
        f"[SIM_TIME:{random.randint(10,5000)}ns] [{severity}] {module}\n"
        f"{message}\n"
        f"Trace: {stack_trace}"
    )

    return "unusual_log", severity, log_message, "unusual_template", 0


# -----------------------------
# Main log generation
# -----------------------------

dataset = []

for i in range(NUM_LOGS):

    r = random.random()

    if r < 0.03:                     # 3% rare failures
        bug_type, severity, log_message, template, anomaly = generate_rare_log()

    elif r < 0.10:                   # 7% unusual logs
        bug_type, severity, log_message, template, anomaly = generate_unusual_log()

    else:                            # 90% normal logs
        bug_type, severity, log_message, template, anomaly = generate_normal_log(i)

    dataset.append({
        "test_id": i+1,
        "module": random.choice(modules),
        "bug_type": bug_type,
        "severity": severity,
        "build_version": random.choice(build_versions),
        "timestamp": f"{random.randint(10,5000)}ns",
        "cluster_label": bug_type,
        "anomaly": anomaly,
        "log_template": template,
        "log_message": log_message
    })


# -----------------------------
# Save dataset
# -----------------------------

with open("dataset/rtl_verification_dataset.csv","w",newline="") as f:

    writer = csv.DictWriter(
        f,
        fieldnames=[
            "test_id",
            "module",
            "bug_type",
            "severity",
            "build_version",
            "timestamp",
            "cluster_label",
            "anomaly",
            "log_template",
            "log_message"
        ]
    )

    writer.writeheader()
    writer.writerows(dataset)


print("Dataset generated successfully")
print("Total logs generated:", NUM_LOGS)
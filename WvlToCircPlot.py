import math as m
import numpy as np
import matplotlib.pyplot as plt

dx = 0.01
# y(x) = A sin (2pi/lambda x)
# C = 

def wave(A, wvl, x):
    return A * m.sin(((2*m.pi)/wvl) * x )

# def dydx(A, wvl, x):
#     return A * ((2*m.pi)/wvl) * m.cos(((2*m.pi)/wvl) * x)

# def arcpart(A, wvl, x):
#     return m.sqrt(1 + dydx(A, wvl, x))

def dy(A, wvl, x):
    return wave(A, wvl, x + dx) - wave(A, wvl, x)

def arcpart(A, wvl, x):
    return m.sqrt(dy(A, wvl, x)**2 + dx**2)

# numerical solving of integral:

def calc_arclength(A, wvl):
    L = 0
    for x in np.arange(0.01, wvl, dx):
        L += arcpart(A, wvl, x)
    return L

wvlList = []
circList = []
lastFound = 0


for circumference in np.arange(20, 120, 1):
    circList.append(circumference)

    found = False
    # pi D = C => D = C / pi
    D = circumference / m.pi
    #2a^2 = D^2 => a = sqrt( D^2 / 2)
    # amplitude = 1/2 * a
    amplitude = 0.5 * m.sqrt( (D**2) / 2)

    for wavelength in np.arange(lastFound, 120, 0.005):
        arcLength = calc_arclength(amplitude, wavelength)
        if (circumference < (arcLength + 0.1) and circumference > (arcLength - 0.1)):
            wvlList.append(wavelength)
            lastFound = wavelength
            found = True
            break
    if not found:
            wvlList.append(0)
            wavelength = 0
    print(f"circ={circumference}, then A={amplitude}, wvl={wavelength}")


plt.plot(circList, wvlList)
plt.show()

# It's a line !!!!